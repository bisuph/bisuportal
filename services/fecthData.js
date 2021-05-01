import { fire, db } from "./firebase";

export async function getCampuses() {
    const snapshot = await  db.collection("campus").get()
    return snapshot.docs.map(doc => {
        var data = doc.data()
        data.id = doc.id
        return data
    });
}

export async function getOffices() {
    const snapshot = await  db.collection("office").get()
    return snapshot.docs.map(doc => {
        var data = doc.data()
        data.id = doc.id
        return data
    });
}

export async function getRecords() {
    const snapshot = await  db.collection("record").get()
    return snapshot.docs.map(doc => {
        var data = doc.data()
        data.id = doc.id
        return data
    });
}

export async function getUploadedFiles() {
    const snapshot = await  db.collection("uploaded").get()
    return snapshot.docs.map(doc => {
        var data = doc.data()
        data.id = doc.id
        return data
    });
}

export async function getUploadedFilesPerUser(office,campus) {
    const snapshot = await  db.collection("uploaded").where("office.id", "==", office).where("campus.id", "==", campus).get()
    return snapshot.docs.map(doc => {
        var data = doc.data()
        data.id = doc.id
        return data
    });
}

export async function getUploadedFilesPerAdmin(campus) {
    const snapshot = await  db.collection("uploaded").where("campus.id", "==", campus).get()
    return snapshot.docs.map(doc => doc.data());
}

export async function getUser(email) {
    const snapshot = await  db.collection("User").where("email", "==", email).get()
    return snapshot.docs.map(doc => doc.data());
}


export async function incrementFilesCount(id,campus) {
    const snapshot = await  db.collection("office").doc(id)
    snapshot.update({
        [campus] : fire.firestore.FieldValue.increment(1)
    })
    .then((docRef) => {
        return docRef
    })
    .catch((error) => {
        return error
    });
    
}

export async function decrementFilesCount(id,campus) {
    const snapshot = await  db.collection("office").doc(id)
    snapshot.update({
        [campus] : fire.firestore.FieldValue.increment(-1)
    })
    .then((docRef) => {
        return docRef
    })
    .catch((error) => {
        return error
    });
    
}


export function getOfficesById(id) {
    const snapshot =  db.collection("office").doc(id)
    return snapshot.get().then((doc) => {
        const ex = doc.data()
        ex.id = doc.id
        return ex
    }).catch((error) => {
        console.log("Error getting cached document:", error);
    });
}

export async function checkUserExist(email) {
    var snapshot = await db.collection("User").where('email','==',email).get()
    return snapshot.docs.map(doc => doc.data());
}
