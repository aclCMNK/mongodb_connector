const { MongoDB } = require('./core/mongo_conn.js');
const {Scheme} = require('./core/scheme.js');
const _SCHM_Documentos_ = require("./schemes/documentos.js")

const __MONGO_USER__ = "<USER>";
const __MONGO_PASS__ = "<PASS>";
const __MONGO_CLUSTER__ = "<CLUSTER>";
const __MONGO_APP_NAME__ = "<APP_NAME>";

async function Main() {
    const mongo = new MongoDB({ username: __MONGO_USER__, pass: __MONGO_PASS__, cluster: __MONGO_CLUSTER__, app_name: __MONGO_APP_NAME__ });
    await mongo.run();
    // -----------------------------------------------
    // ADDING A DOCUMENT WITHOUT SCHEMES EVALUATION 
    //const add = await mongo.query("sitiouno", "documentos", { method: "insertOne", query: { cosa: "hola", nombre: "culo" } });
    //console.log(add);
    // -----------------------------------------------
    // ADDING DOCUMENTS BY SCHEMES EVALUATION
    //const new_doc = Scheme.new(_SCHM_Documentos_, { cosa: "persona", nombre: "Camilo" }, {cosa: "persona", nombre: "Mariana", apellido: "Uribe"});
    //const add2 = await mongo.query_scheme("sitiouno", new_doc.scheme, { method: "insertMany" });
    //console.log(add2);
    // -----------------------------------------------
    // QUERY
    const res = await mongo.query("sitiouno", "documentos", { method: "find", query: {}, to_array: true });
    console.log(res);
    // -----------------------------------------------
    await mongo.close();
}

Main();
