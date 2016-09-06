from collections import defaultdict

request = defaultdict(bool)

request['Daily Handle'] = '''
SELECT
    *
FROM myTable aa
JOIN myTable2 ab
    ON aa.id = ab.id
GROUP BY aa.id
'''

request['DAU'] = '''
SELECT
    *
FROM aaaa pd
WHERE pd.dates >= TO_DATE('{0}','YYYY-MM-DD')
    AND pd.dates <= TO_DATE('{1}','YYYY-MM-DD')
GROUP BY
    pd.dates
ORDER BY
    sd.dates desc
'''

