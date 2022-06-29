-- function (columns, where, groupby, orderby)
-- return data_column
-- datavalue
-- organisationUnit
-- period
-- dataElement
-- categoryoptioncombo
-- dataelementcategoryoption
SELECT  value
    FROM datavalue dv
    INNER JOIN organisationUnit o ON (o.organisationUnitid = dv.sourceid )
    INNER JOIN dataelement de USING (dataelementid)
    INNER JOIN period pe USING(periodis)
    INNER JOIN categoryoptioncombo coc USING (categoryoptioncomboid = dv.categoryoption )
    INNER JOIN categoryoptioncombos_categoryoptions cocco USING(categoryoptioncomboid)
    INNER JOIN categorycombos_optioncombos ccoc USING (categoryoptioncomboid) limit 10
    INNER JOIN dataelementcategoryoption deco USING (categoryoptionid)
    INNER JOIN categorycombo cc USING (categorycomboid)

    ;
