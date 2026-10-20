-- Run through an authorized Analytics Engine SQL reader after activation.
-- Click counts are not unique visitors, appointments, diagnoses or patients.
-- Source is the current page referrer category, not cross-page acquisition.
SELECT
  blob1 AS event,
  blob2 AS page,
  blob3 AS target,
  blob4 AS source,
  SUM(double1 * _sample_interval) AS estimated_clicks
FROM drcyc_site_events
WHERE timestamp >= NOW() - INTERVAL '28' DAY
GROUP BY event, page, target, source
ORDER BY estimated_clicks DESC
LIMIT 200
