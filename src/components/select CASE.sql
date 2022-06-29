with query as (
  select CASE
      WHEN pt.name = 'Daily' THEN to_char(p.startdate, 'YYYYMM')
      ELSE ''
    END AS daily,
    CASE
      WHEN pt.name = 'Daily' THEN to_char(p.startdate, 'YYYY"W"W')
      WHEN pt.name = 'Weekly' THEN to_char(p.startdate, 'YYYY"W"W')
      ELSE ''
    END AS weekly,
    CASE
      WHEN pt.name = 'Daily' THEN to_char(p.startdate, 'YYYYMM')
      WHEN pt.name = 'Weekly' THEN to_char(p.startdate, 'YYYYMM')
      WHEN pt.name = 'Monthly' THEN to_char(p.startdate, 'YYYYMM')
      ELSE ''
    END AS monthly,
    CASE
      WHEN pt.name = 'Daily' THEN to_char(p.startdate, 'YYYY"Q"Q')
      WHEN pt.name = 'Weekly' THEN to_char(p.startdate, 'YYYY"Q"Q')
      WHEN pt.name = 'Monthly' THEN to_char(p.startdate, 'YYYY"Q"Q')
      WHEN pt.name = 'Quarterly' THEN to_char(p.startdate, 'YYYY"Q"Q')
      ELSE ''
    END AS quarterly,
    CASE
      WHEN pt.name = 'Daily' THEN to_char(p.startdate, 'YYYY')
      WHEN pt.name = 'Weekly' THEN to_char(p.startdate, 'YYYY')
      WHEN pt.name = 'Monthly' THEN to_char(p.startdate, 'YYYY')
      WHEN pt.name = 'Quarterly' THEN to_char(p.startdate, 'YYYY')
      WHEN pt.name = 'Yearly' THEN to_char(p.startdate, 'YYYY')
      ELSE ''
    END AS yearly,
    CASE
      WHEN pt.name = 'Daily' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'April'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'April'
      END
      WHEN pt.name = 'Weekly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'April'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'April'
      END
      WHEN pt.name = 'Monthly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'April'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'April'
      END
      WHEN pt.name = 'Quarterly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'April'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 4 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'April'
      END
      WHEN pt.name = 'FinancialApril' THEN to_char(p.startdate, 'YYYY"April"')
      ELSE ''
    END AS financialapril,
    CASE
      WHEN pt.name = 'Daily' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'July'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'July'
      END
      WHEN pt.name = 'Weekly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'July'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'July'
      END
      WHEN pt.name = 'Monthly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'July'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'July'
      END
      WHEN pt.name = 'Quarterly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'July'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 7 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'July'
      END
      WHEN pt.name = 'FinancialJuly' THEN to_char(p.startdate, 'YYYY"July"')
      ELSE ''
    END AS financialjuly,
    CASE
      WHEN pt.name = 'Daily' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'Oct'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'Oct'
      END
      WHEN pt.name = 'Weekly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'Oct'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'Oct'
      END
      WHEN pt.name = 'Monthly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'Oct'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'Oct'
      END
      WHEN pt.name = 'Quarterly' THEN CASE
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) < 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) -1 || 'Oct'
        WHEN EXTRACT(
          MONTH
          FROM p.startdate
        ) >= 10 THEN EXTRACT(
          YEAR
          FROM p.startdate
        ) || 'Oct'
      END
      WHEN pt.name = 'FinancialOct' THEN to_char(p.startdate, 'YYYY"Oct"')
      ELSE ''
    END AS financialoct,
    (
      select jsonb_object_agg(oug.uid, true)
      from orgunitgroup oug
        inner join orgunitgroupmembers ougm using(orgunitgroupid)
      where dv.sourceid = ougm.organisationunitid
    ) as groups,
    (
      select jsonb_object_agg(ougs.uid, oug.uid)
      from orgunitgroupmembers ougm
        inner join orgunitgroup oug using(orgunitgroupid)
        inner join orgunitgroupsetmembers ougsm using(orgunitgroupid)
        inner join orgunitgroupset ougs using(orgunitgroupsetid)
      where ougm.organisationunitid = dv.sourceid
    ) as groupset,
    (
      select jsonb_object_agg('level' || row_number, foo)
      from (
          SELECT foo,
            ROW_NUMBER() OVER()
          FROM regexp_split_to_table(
              ou.path,
              '\/'
            ) AS foo
          where foo <> ''
        ) levels
    ) levels,
    ou.uid ou,
    ou.hierarchylevel,
    (dv.value::decimal),
    aoc.uid ao,
    coc.uid co,
    de.uid dx,
    p.startdate,
    p.enddate,
    pt.name,
    dv.storedby,
    dv.created,
    dv.lastupdated,
    dv.comment,
    dv.followup,
    dv.deleted,
    (
      select jsonb_object_agg(dec.uid, deco.uid)
      from dataelementcategoryoption deco
        inner join categories_categoryoptions cco using(categoryoptionid)
        inner join dataelementcategory dec using(categoryid)
      where deco.name = any (string_to_array(coc.name, ', '))
        and cco.categoryid in (
          select categoryid
          from categorycombos_categories
          where categorycomboid = ccoc.categorycomboid
        )
    ) coc_categories,
    (
      select jsonb_object_agg(dec.uid, deco.uid)
      from dataelementcategoryoption deco
        inner join categories_categoryoptions cco using(categoryoptionid)
        inner join dataelementcategory dec using(categoryid)
      where deco.name = any (string_to_array(aoc.name, ', '))
        and cco.categoryid in (
          select categoryid
          from categorycombos_categories
          where categorycomboid = acoc.categorycomboid
        )
    ) aoc_categories
  from datavalue dv
    inner join dataelement de using(dataelementid)
    inner join period p using(periodid)
    inner join periodtype pt using(periodtypeid)
    inner join categoryoptioncombo coc using(categoryoptioncomboid)
    inner join categorycombos_optioncombos ccoc using(categoryoptioncomboid)
    inner join categoryoptioncombo aoc on(
      aoc.categoryoptioncomboid = dv.attributeoptioncomboid
    )
    inner join categorycombos_optioncombos acoc on(
      acoc.categoryoptioncomboid = dv.attributeoptioncomboid
    )
    inner join organisationunit ou on(ou.organisationunitid = dv.sourceid)
  where de.uid = any (
      regexp_split_to_array('neMsKQZy3jl YG5ypcdvGjy', '\s+')
    )
  limit 10
)
select SUM(value)
from query;