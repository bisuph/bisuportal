import { auth, db } from "./firebase";

export async function getCampuses() {
    const snapshot = await  db.collection("Campuses").get()
    return snapshot.docs.map(doc => doc.id);
}

export async function getOffices() {
    const snapshot = await  db.collection("Offices").get()
    return snapshot.docs.map(doc => doc.id);
}

export async function getRecords() {
    const snapshot = await  db.collection("Records").get()
    return snapshot.docs.map(doc => doc.id);
}

export async function getUploadedFiles() {
    const snapshot = await  db.collection("UploadedFiles").get()
    return snapshot.docs.map(doc => doc.data());
}

export async function getUploadedFilesPerUser(office,campus) {
    const snapshot = await  db.collection("UploadedFiles").where("offices", "==", office).where("campus", "==", campus).get()
    return snapshot.docs.map(doc => doc.data());
}

export async function getUploadedFilesPerAdmin(campus) {
    const snapshot = await  db.collection("UploadedFiles").where("campus", "==", campus).get()
    return snapshot.docs.map(doc => doc.data());
}
