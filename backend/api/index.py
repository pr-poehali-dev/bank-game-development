'''
Business: API для банковской игры с мультиплеером
Args: event с httpMethod, body, queryStringParameters
Returns: HTTP response с данными игры
'''
import json
import os
from typing import Dict, Any
from datetime import datetime, date
import psycopg2
from psycopg2.extras import RealDictCursor

def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        path = event.get('queryStringParameters', {}).get('path', '')
        
        if method == 'GET' and path == 'user':
            user_id = event.get('queryStringParameters', {}).get('user_id')
            cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(user), default=json_serial)
            }
        
        if method == 'POST' and path == 'user':
            body = json.loads(event.get('body', '{}'))
            username = body.get('username')
            
            cur.execute(
                'INSERT INTO users (username, balance, is_bot) VALUES (%s, %s, %s) RETURNING *',
                (username, 170000, False)
            )
            user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(user), default=json_serial)
            }
        
        if method == 'PUT' and path == 'balance':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            new_balance = body.get('balance')
            
            cur.execute('UPDATE users SET balance = %s WHERE id = %s', (new_balance, user_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        if method == 'GET' and path == 'marketplace':
            cur.execute('''
                SELECT mp.*, u.username as seller_name 
                FROM marketplace_products mp 
                JOIN users u ON mp.seller_id = u.id 
                WHERE mp.is_sold = false 
                ORDER BY mp.created_at DESC
            ''')
            products = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(p) for p in products], default=json_serial)
            }
        
        if method == 'POST' and path == 'marketplace':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO marketplace_products (seller_id, name, price, description, image_url) 
                VALUES (%s, %s, %s, %s, %s) 
                RETURNING *
            ''', (
                body['seller_id'], 
                body['name'], 
                body['price'], 
                body.get('description', ''), 
                body.get('image_url', '')
            ))
            product = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(product), default=json_serial)
            }
        
        if method == 'POST' and path == 'marketplace/buy':
            body = json.loads(event.get('body', '{}'))
            buyer_id = body['buyer_id']
            product_id = body['product_id']
            
            cur.execute('SELECT * FROM marketplace_products WHERE id = %s AND is_sold = false', (product_id,))
            product = cur.fetchone()
            
            if not product:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Product not available'})
                }
            
            cur.execute('SELECT balance FROM users WHERE id = %s', (buyer_id,))
            buyer = cur.fetchone()
            
            if buyer['balance'] < product['price']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient funds'})
                }
            
            cur.execute('UPDATE users SET balance = balance - %s WHERE id = %s', (product['price'], buyer_id))
            cur.execute('UPDATE users SET balance = balance + %s WHERE id = %s', (product['price'], product['seller_id']))
            cur.execute('UPDATE marketplace_products SET is_sold = true WHERE id = %s', (product_id,))
            
            cur.execute('''
                INSERT INTO transactions (from_user_id, to_user_id, amount, type, description) 
                VALUES (%s, %s, %s, %s, %s)
            ''', (buyer_id, product['seller_id'], product['price'], 'marketplace_purchase', product['name']))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        if method == 'GET' and path == 'realestate':
            cur.execute('''
                SELECT re.*, u.username as seller_name 
                FROM real_estate re 
                JOIN users u ON re.seller_id = u.id 
                WHERE re.is_sold = false 
                ORDER BY re.created_at DESC
            ''')
            properties = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(p) for p in properties], default=json_serial)
            }
        
        if method == 'POST' and path == 'realestate':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO real_estate (seller_id, title, price, address, rooms, area, description, image_url) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) 
                RETURNING *
            ''', (
                body['seller_id'],
                body['title'],
                body['price'],
                body.get('address', ''),
                body.get('rooms', 1),
                body.get('area', 0),
                body.get('description', ''),
                body.get('image_url', '')
            ))
            property_item = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(property_item), default=json_serial)
            }
        
        if method == 'POST' and path == 'realestate/buy':
            body = json.loads(event.get('body', '{}'))
            buyer_id = body['buyer_id']
            property_id = body['property_id']
            
            cur.execute('SELECT * FROM real_estate WHERE id = %s AND is_sold = false', (property_id,))
            property_item = cur.fetchone()
            
            if not property_item:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Property not available'})
                }
            
            cur.execute('SELECT balance FROM users WHERE id = %s', (buyer_id,))
            buyer = cur.fetchone()
            
            if buyer['balance'] < property_item['price']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient funds'})
                }
            
            cur.execute('UPDATE users SET balance = balance - %s WHERE id = %s', (property_item['price'], buyer_id))
            cur.execute('UPDATE users SET balance = balance + %s WHERE id = %s', (property_item['price'], property_item['seller_id']))
            cur.execute('UPDATE real_estate SET is_sold = true WHERE id = %s', (property_id,))
            
            cur.execute('''
                INSERT INTO transactions (from_user_id, to_user_id, amount, type, description) 
                VALUES (%s, %s, %s, %s, %s)
            ''', (buyer_id, property_item['seller_id'], property_item['price'], 'realestate_purchase', property_item['title']))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        if method == 'GET' and path == 'deposits':
            user_id = event.get('queryStringParameters', {}).get('user_id')
            cur.execute('SELECT * FROM user_deposits WHERE user_id = %s ORDER BY created_at DESC', (user_id,))
            deposits = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(d) for d in deposits], default=json_serial)
            }
        
        if method == 'POST' and path == 'deposits':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO user_deposits (user_id, deposit_name, amount, rate, term_months, expires_at) 
                VALUES (%s, %s, %s, %s, %s, NOW() + INTERVAL '%s months') 
                RETURNING *
            ''', (
                body['user_id'],
                body['deposit_name'],
                body['amount'],
                body['rate'],
                body['term_months'],
                body['term_months']
            ))
            deposit = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(deposit), default=json_serial)
            }
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Endpoint not found'})
        }
        
    finally:
        cur.close()
        conn.close()