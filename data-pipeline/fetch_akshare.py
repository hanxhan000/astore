"""
AKShare 数据管道骨架
- 目标：拉取指定股票的日线数据，输出到 webapp/public/data 目录，供前端渲染
- 运行：python fetch_akshare.py 000001 600519
"""

import sys
import json
import os
from datetime import datetime

# 可根据实际环境安装与引入
# pip install akshare
try:
    import akshare as ak
except Exception:
    ak = None

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'webapp', 'public', 'data')


def fetch_daily(symbol: str):
    """拉取指定股票的日线数据，返回与前端结构一致的字典"""
    if ak is None:
        # 无 akshare 环境时给出提示并返回空结构
        return {
            "symbol": symbol,
            "name": symbol,
            "kline": []
        }
    # A 股日线示例：使用 stock_zh_a_daily 接口
    # 注意：AKShare 对复权类型有不同参数，后续可按需调整
    df = ak.stock_zh_a_daily(symbol=symbol, adjust="qfq")
    df = df.tail(120)  # 仅保留最近 120 根 K 线（示例）
    kline = []
    for _, row in df.iterrows():
        kline.append({
            "date": row["date"],
            "open": float(row["open"]),
            "high": float(row["high"]),
            "low": float(row["low"]),
            "close": float(row["close"]),
            "volume": int(row.get("volume", 0))
        })
    return {
        "symbol": symbol,
        "name": symbol,
        "kline": kline
    }


def save_json(symbol: str, data: dict):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, f"sample_{symbol}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[OK] {symbol} -> {path}")


def main():
    args = sys.argv[1:]
    if not args:
        print("用法: python fetch_akshare.py <symbol1> <symbol2> ...")
        print("示例: python fetch_akshare.py 000001 600519")
        return
    for symbol in args:
        data = fetch_daily(symbol)
        save_json(symbol, data)
    print(f"完成，时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()