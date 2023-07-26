const { writeFile } = require("fs")
const data = require("./initial_import.json")

const insulinGuidelines = {
    80: 10,    // Glucosa < 80
    129: 12,   // 80 <= Glucosa < 129
    149: 13,  // 129 <= Glucosa < 149
    199: 14,  // 149 <= Glucosa < 199
    249: 15,  // 199 <= Glucosa < 249
    300: 16,  // 249 <= Glucosa < 299
};

const mod_data = Object.values(data.formData).map((elem) => {
    let insulinValue = 18;
    const value = elem.bloodGlucose;
    for (const glucoseThreshold in insulinGuidelines) {
        if (value < parseInt(glucoseThreshold)) {
            insulinValue = insulinGuidelines[glucoseThreshold];
            break;
        }
    }

    return {
        ...elem,
        insulin: insulinValue,
    }
});

const modifiedData = {
    formData: mod_data,
};

// Convertir el objeto a formato JSON
const jsonData = JSON.stringify(modifiedData, null, 2);

// Escribir el resultado en un nuevo archivo JSON
writeFile("modified_data.json", jsonData, (err) => {
    if (err) {
        console.error("Error al escribir el archivo:", err);
    } else {
        console.log("Datos modificados escritos en modified_data.json");
    }
});