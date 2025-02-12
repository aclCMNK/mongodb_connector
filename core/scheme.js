const Scheme = {
    new: function(scheme, ...values) {
        if (!scheme || !values) return { error: true, name: "scheme_values_not_found" };
        if (typeof scheme !== "object") return { error: true, name: "scheme_not_object" };
        if (!scheme.name) return { error: true, name: "scheme_name_not_found" };
        if (!Array.isArray(values)) return { error: true, name: "values_not_array" };
        const new_scheme = {
            collection: scheme.name,
            values: []
        };
        for(const value of values){
            const new_value = {};
            for(const k in scheme.fields){
                const v = scheme.fields[k];
                // CHECK REQUIRED FIELD
                if(!value[k] && v.required) return { error: true, name: "field_required", field: k, value };
                // CHECK FIELD TYPE MATCH
                if(typeof value[k] !== v.type && typeof value[k] !== "undefined") return { error: true, name: "field_type_mismatch", field: k, value };
                new_value[k] = value[k] || "";
            }
            new_scheme.values.push(new_value);
        }
        return {error: false, name: "scheme_success", scheme: new_scheme};
    }
}

exports.Scheme = Scheme;
