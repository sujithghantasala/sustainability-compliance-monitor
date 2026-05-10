INSERT INTO compliance_record (company_name, compliance_score, status, description, created_at)
SELECT seed.company_name, seed.compliance_score, seed.status, seed.description, CURRENT_TIMESTAMP
FROM (
    VALUES
    ('GreenGrid Manufacturing', 92, 'COMPLIANT', 'Uses renewable electricity contracts and tracks supplier emissions quarterly.'),
    ('BlueRiver Textiles', 68, 'PENDING_REVIEW', 'Water recycling program is active, but wastewater testing records are incomplete.'),
    ('SolarPeak Logistics', 81, 'COMPLIANT', 'Fleet emissions are monitored and electric vehicle adoption is underway.'),
    ('UrbanLeaf Foods', 74, 'PENDING_REVIEW', 'Packaging reduction goals exist, but supplier certification evidence needs review.'),
    ('EcoForge Steel', 55, 'NON-COMPLIANT', 'Energy intensity remains above target and remediation plan is overdue.'),
    ('ClearSky Electronics', 88, 'COMPLIANT', 'E-waste handling, conflict minerals screening, and energy reporting are documented.'),
    ('RiverStone Chemicals', 49, 'NON-COMPLIANT', 'Hazardous waste manifests and spill response drills are missing for two sites.'),
    ('NorthStar Retail', 79, 'PENDING_REVIEW', 'Store energy audits are complete, but Scope 3 reporting is still being consolidated.'),
    ('TerraNova Packaging', 95, 'COMPLIANT', 'High recycled content, ISO 14001 certification, and supplier audits are current.'),
    ('BrightPath Construction', 63, 'PENDING_REVIEW', 'Construction waste diversion is improving, but site-level evidence is inconsistent.'),
    ('OceanGate Fisheries', 44, 'NON-COMPLIANT', 'Traceability documentation is incomplete and corrective actions are pending.'),
    ('Everwood Furniture', 86, 'COMPLIANT', 'Certified timber sourcing and low-VOC finishing processes are verified.'),
    ('MetroCharge Energy', 91, 'COMPLIANT', 'Charging network runs on renewable tariffs with published carbon intensity metrics.'),
    ('PureCycle Plastics', 83, 'COMPLIANT', 'Closed-loop recycling process and material recovery rates are independently reviewed.'),
    ('AquaPure Beverages', 72, 'PENDING_REVIEW', 'Water stewardship targets are defined, but plant-level consumption variance needs analysis.'),
    ('Summit Apparel', 58, 'NON-COMPLIANT', 'Supplier labor and environmental audit gaps remain open beyond target dates.'),
    ('WindFarm Components', 89, 'COMPLIANT', 'Lifecycle assessment records and renewable sourcing controls are maintained.'),
    ('HarvestLink Agritech', 76, 'PENDING_REVIEW', 'Soil health monitoring is active, but fertilizer runoff data needs validation.'),
    ('CoreLite Cement', 47, 'NON-COMPLIANT', 'Carbon reduction roadmap is not aligned with current production emissions.'),
    ('CleanWave Shipping', 69, 'PENDING_REVIEW', 'Fuel efficiency metrics improved, but port emissions controls are incomplete.'),
    ('BioNest Labs', 94, 'COMPLIANT', 'Chemical handling, waste segregation, and energy tracking meet internal standards.'),
    ('ReNew Data Centers', 90, 'COMPLIANT', 'Power usage effectiveness and renewable procurement are reported monthly.'),
    ('SafeHarvest Grocers', 80, 'COMPLIANT', 'Food waste diversion and refrigeration leak monitoring are operating effectively.'),
    ('IronTrail Mining', 39, 'NON-COMPLIANT', 'Tailings inspection records and biodiversity restoration evidence are insufficient.'),
    ('LumaHome Appliances', 84, 'COMPLIANT', 'Product efficiency standards and take-back programs are documented.'),
    ('EcoMed Devices', 77, 'PENDING_REVIEW', 'Sterilization emissions data requires review before final compliance scoring.'),
    ('PrairieWind Farms', 87, 'COMPLIANT', 'Water, soil, and renewable energy indicators are verified for the current period.'),
    ('CityLoop Transit', 73, 'PENDING_REVIEW', 'Fleet transition plan is funded, but charging infrastructure milestones are delayed.'),
    ('StoneBridge Paper', 52, 'NON-COMPLIANT', 'Deforestation risk screening and effluent controls need corrective action.'),
    ('NexGen Batteries', 82, 'COMPLIANT', 'Battery recycling chain of custody and safety controls are audit-ready.')
) AS seed(company_name, compliance_score, status, description)
WHERE NOT EXISTS (
    SELECT 1
    FROM compliance_record existing
    WHERE existing.company_name = seed.company_name
);
