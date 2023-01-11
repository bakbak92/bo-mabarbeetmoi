<template>
    <div class="product-item">
        <h2>{{isNew ? `Nouveau produit` : `Produit : ${$route.params.id}`}}</h2>
        <form @submit.prevent="save">
            <form-row>
                <form-input>
                    <p>Nom</p>
                    <input type="text" v-model="product.name">
                </form-input>
                <form-input>
                    <p>Categorie</p>
                    <select v-model="product.category">
                        <option :value="null">Selectionner une categorie</option>
                        <option v-for="category in categories" 
                        :key="category.id" 
                        :value="category.name">
                            {{category.name}}
                        </option>
                    </select>
                </form-input>
            </form-row>
            <form-row>
                <form-input>
                    <p>Prix</p>
                    <input type="number" v-model="product.price">
                </form-input>
                <form-input>
                    <p>Stock</p>
                    <input type="number" v-model="product.stock">
                </form-input>
            </form-row>
            <form-row>
                <form-input>
                    <p>Description</p>
                    <MarkdownEditor v-model="product.description"/>
                </form-input>
                <form-input>
                    <p>Informations</p>
                    <MarkdownEditor v-model="product.informations"/>
                </form-input>
                <form-input>
                    <p>Bienfaits</p>
                    <MarkdownEditor v-model="product.goods"/>
                </form-input>
            </form-row>
            <form-row>
                <form-input>
                    <p>Statut</p>
                    <select v-model="product.isPublished">
                        <option :value="true">Publié</option>
                        <option :value="false">Pas publié</option>
                    </select>
                </form-input>
            </form-row>
            <form-row>
                <form-input>
                    <p>Image principal</p>
                    <input type="file" @change="handleFile" v-if="!product.image.src">
                </form-input>
            </form-row>
            <div class="content-img" v-if="img.src">
                <div>
                    <button type="button" @click="removeImgMain">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <img :src="img.src" alt="">
                </div>
            </div>
            <div class="content-img" v-if="product.image.src">
                <div>
                    <button type="button" @click="deleteImageMain">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <img :src="product.image.src">
                </div>
            </div>
            <form-row>
                <form-input>
                    <p>Image secondaire</p>
                    <input type="file" @change="handleFiles" multiple>
                </form-input>
            </form-row>
            <div class="content-img">
                <div v-for="media in medias" 
                    :key="media.src">
                    <button type="button" @click="removeMedia(media.path)">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <img :src="media.src">
                </div>
                <div v-for="media in product.medias" :key="media.src">
                    <button type="button" @click="deleteMedia(media.path)">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <img :src="media.src">
                </div>
            </div>
            <content-btn>
                <button-app v-if="!isNew"
                role="remove" 
                @click="deleteProduct">
                    Supprimer
                </button-app>
                <button-app role="save" type="submit">
                    Sauvegarder
                </button-app>
            </content-btn>
        </form>
    </div>
</template>
<script>
import FormInput from "../components/FormInput.vue";
import FormRow from "../components/FormRow.vue";
import MarkdownEditor from "../components/MarkdownEditor.vue";
import { db, storage } from "../firebaseConfig"
import { collection, getDocs, setDoc, doc, getDoc, addDoc, deleteDoc} from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import ContentBtn from "../components/ContentBtn.vue";
import ButtonApp from "../components/ButtonApp.vue";

export default {
    components: {
        FormInput,
        FormRow,
        MarkdownEditor,
        ContentBtn,
        ButtonApp
    },
    data(){
        return {
            categories: [],
            product: {
                name: null,
                stock: 0,
                image: {
                    path: null,
                    src: null
                },
                informations: null,
                isPublished: false,
                price: 0,
                description: null,
                goods: null,
                category: null,
                medias: []
            },
            img: {
                name: null,
                path: null,
                src: null,
                file: null
            },
            medias: []
        }
    },
    mounted(){
        console.log(this.$route.params.id);
        const dbCategories = collection(db, "categories");
        getDocs(dbCategories).then((snapshot) => {
            snapshot.forEach((docSnap) => {
                this.categories.push({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            })
        })
        if(!this.isNew){
            const docRef = doc(db, "products", this.$route.params.id);
            getDoc(docRef).then((docSnap) => {
                console.log(docSnap.data());
                this.product = docSnap.data()
            })

        }
    },
    computed: {
        isNew(){
            return this.$route.params.id === "new";
        }
    },
    methods: {
        deleteProduct(){
            deleteDoc(doc(db, "products", this.$route.params.id)).then(() => {
                this.$router.push("/products")
            })
        },
        removeImage(){
            this.img = {
                name: null,
                path: null,
                src: null,
                file: null
            }
        },
        removeMedia(path){
            this.medias = this.medias.filter((media) => {
                return media.path !== path;
            })
        },
        deleteImageMain(){
            if(confirm("Etes vous sur de supprimer cette image")){
                const desertRef = ref(storage, this.product.image.path);
                this.product.image = {
                    path: null,
                    src: null
                }
                deleteObject(desertRef).then(() => {
                    this.$notify({
                        type: "success",
                        text: "Image supprimé"
                    });
                    this.update();
                }) 
            }
        },
        deleteMedia(path){
            if(confirm("Etes vous sur de supprimer cette image")){
                const desertRef = ref(storage, path);
                this.product.medias = this.product.medias.filter((media) => {
                    return media.path !== path;
                })
                console.log(this.product.medias);
                deleteObject(desertRef).then(() => {
                    this.$notify({
                        type: "success",
                        text: "Image supprimé"
                    });
                    this.update();
                })
            }
        },
        handleFile(e){
            this.img.file = e.target.files[0]
            this.img.name = this.img.file.name;
            this.img.path = `images/${Date.now()}-${this.img.file.name}`
            const fileReader = new FileReader()
            fileReader.addEventListener('load', (evt) => {
                this.img.src = fileReader.result;
            })
            fileReader.readAsDataURL(this.img.file);
        },
        saveImage(){
            return new Promise((resolve) => {
                if(this.img.src){
                    const storageRef = ref(storage, this.img.path);
                    const uploadTask = uploadBytesResumable(storageRef, this.img.file);
                    uploadTask.on("state_changed", (snapshot) => {
                        console.log(snapshot);
                    }, (error) => {
                        console.log(error);
                    }, () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            this.product.image.path = this.img.path;
                            this.product.image.src = downloadURL;
                            this.img = {
                                name: null,
                                path: null,
                                src: null,
                                file: null
                            }
                            resolve()
                        });
                    })
                }else{
                    resolve()
                }
            })
        },
        saveAllImages(){
            return new Promise((resolve) => {
                if(this.medias.length){
                    let medias = [];
                    Promise.all(
                        this.medias.map((media) => {
                            return new Promise((resolve) => {
                                const storageRef = ref(storage, media.path);
                                const uploadTask = uploadBytesResumable(storageRef, media.file);
                                uploadTask.on("state_changed", (snapshot) => {
                                    console.log(snapshot);
                                }, (error) => {
                                    console.log(error);
                                }, () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                        medias.push({
                                            src: downloadURL,
                                            path: media.path
                                        })
                                        resolve()
                                    });
                                })
                            })
                        })
                    ).then(() => {
                        this.medias = []
                        medias.forEach((media) => {
                            this.product.medias.push(media)
                        })
                        resolve()
                    })
                }else{
                    resolve()
                }
            })
        },
        handleFiles(e){
            for(let i = 0; i < e.target.files.length; i++){
                const file = e.target.files[i];
                const fileReader = new FileReader()
                fileReader.addEventListener('load', (evt) => {
                    this.medias.push({
                        path: `images/${Date.now()}-${file.name}`,
                        src: evt.target.result,
                        name: file.name,
                        file: file
                    })
                })
                fileReader.readAsDataURL(file)
            }
        },
        save(){
            Promise.all([
                this.saveImage(),
                this.saveAllImages()
            ]).then(() => {
                if(this.isNew){
                    this.add();
                }else{
                    console.log(this.product);
                    this.update();
                }
            })
        },
        update(){
            setDoc(doc(db, "products", this.$route.params.id), this.product)
            .then(() => {
                this.$notify({
                    type: "success",
                    text: "Produit bien modifié"
                });
            }).catch((error) => {
                console.log(error.code, error.message);
                this.$notify({
                    type: "error",
                    text: `${error.code} ${error.message}`
                });
            })
        },
        add(){
            addDoc(collection(db, "products"), this.product).then((docRef) => {
                this.$notify({
                    type: "success",
                    text: "Produit bien ajouté"
                });
                this.$router.push("/products/"+docRef.id)
            }).catch((error) => {
                console.log(error.code, error.message);
                this.$notify({
                    type: "error",
                    text: `${error.code} ${error.message}`
                });
            })
        }
    }
}
</script>
<style lang="scss">
.product-item{
    padding: 16px;
    .content-img{
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding: 16px 0;
        img{
            width: 300px;
        }
        div{
            position: relative;
            button{
                position: absolute;
                top: 8px;
                right: 8px;
                cursor: pointer;
            }
        }
    }
}
</style>