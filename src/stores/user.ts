import { defineStore } from "pinia"
import { auth } from "../firebaseConfig"
import {onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth"

export const useUserStore = defineStore("user", {
    state: () => ({
        connected: false
    }),
    actions: {
        signIn(email, password){
            return new Promise((resolve, reject) => {
                signInWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    console.log(user);
                    this.connected = true;
                    window.location.href = "/products"
                })
                .catch((error) => {
                    console.log(error.code, error.message);
                    reject();
                })
            })
        },
        logIn(){
            return new Promise((resolve, reject) => {
                onAuthStateChanged(auth, (user) => {
                    if(user) {
                        this.connected = true
                        resolve();
                    }else{
                        //window.location.href = "/products"
                        reject();
                    }
                })
            })
        },
        logOut(){
            signOut(auth).then(() => {
                this.connected = false;
                window.location.href = "/login";
            }).catch((error) => {
                console.log(error.code, error.message);
            })
        }
    }
})