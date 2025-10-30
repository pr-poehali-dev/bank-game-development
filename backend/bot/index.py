'''
Business: Бот для автоматической покупки товаров
Args: event с httpMethod
Returns: HTTP response с результатом работы бота
'''
import json
import os
import random
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def create_bot_user(conn, cur):
    bot_names = [
        'Алексей', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Елена',
        'Иван', 'Ольга', 'Андрей', 'Наталья', 'Михаил', 'Татьяна'
    ]
    
    name = random.choice(bot_names)
    username = f'bot_{name}_{random.randint(1000, 9999)}'
    
    try:
        cur.execute(
            'INSERT INTO users (username, balance, is_bot) VALUES (%s, %s, %s) RETURNING *',
            (username, random.randint(50000, 500000), True)
        )
        bot = cur.fetchone()
        conn.commit()
        return bot
    except:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        purchases_made = 0
        
        cur.execute('SELECT * FROM marketplace_products WHERE is_sold = false ORDER BY RANDOM() LIMIT 3')
        products = cur.fetchall()
        
        for product in products:
            if random.random() < 0.3:
                bot = create_bot_user(conn, cur)
                
                if bot and bot['balance'] >= product['price']:
                    cur.execute('UPDATE users SET balance = balance - %s WHERE id = %s', (product['price'], bot['id']))
                    cur.execute('UPDATE users SET balance = balance + %s WHERE id = %s', (product['price'], product['seller_id']))
                    cur.execute('UPDATE marketplace_products SET is_sold = true WHERE id = %s', (product['id'],))
                    
                    cur.execute('''
                        INSERT INTO transactions (from_user_id, to_user_id, amount, type, description) 
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (bot['id'], product['seller_id'], product['price'], 'bot_purchase', product['name']))
                    
                    conn.commit()
                    purchases_made += 1
        
        cur.execute('SELECT * FROM real_estate WHERE is_sold = false ORDER BY RANDOM() LIMIT 2')
        properties = cur.fetchall()
        
        for property_item in properties:
            if random.random() < 0.2:
                bot = create_bot_user(conn, cur)
                
                if bot and bot['balance'] >= property_item['price']:
                    cur.execute('UPDATE users SET balance = balance - %s WHERE id = %s', (property_item['price'], bot['id']))
                    cur.execute('UPDATE users SET balance = balance + %s WHERE id = %s', (property_item['price'], property_item['seller_id']))
                    cur.execute('UPDATE real_estate SET is_sold = true WHERE id = %s', (property_item['id'],))
                    
                    cur.execute('''
                        INSERT INTO transactions (from_user_id, to_user_id, amount, type, description) 
                        VALUES (%s, %s, %s, %s, %s)
                    ''', (bot['id'], property_item['seller_id'], property_item['price'], 'bot_purchase', property_item['title']))
                    
                    conn.commit()
                    purchases_made += 1
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'purchases_made': purchases_made,
                'timestamp': datetime.now().isoformat()
            }, default=json_serial)
        }
        
    finally:
        cur.close()
        conn.close()
