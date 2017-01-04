from pandas_datareader import data as web
import datetime as dt
utc = dt.datetime.utcnow()
start = dt.datetime(2010, 1, 1)
end = utc
f=web.DataReader("F", 'yahoo', start, end)

print(f)
