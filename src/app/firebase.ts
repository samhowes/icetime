import {Inject, Injectable} from "@angular/core";
import {firebaseAppToken} from "ng-firebase-lite";
import {addDoc, collection, connectFirestoreEmulator, Firestore, getFirestore, Timestamp} from "@firebase/firestore";
import {FirebaseApp} from "@firebase/app";
import {environment} from "../environments/environment";
import {connectAuthEmulator, getAuth, Auth} from "@firebase/auth";
import {ObjMaps} from "@lib/objMap";
import {FirebaseStorage, getStorage} from "@firebase/storage"


@Injectable({providedIn: 'root'})
export class Firebase {
  db!: Firestore
  errors: any[] = [];
  storage: FirebaseStorage;
  auth: Auth;

  constructor(
    @Inject(firebaseAppToken) public app: FirebaseApp,
  ) {
    this.db = getFirestore(this.app)
    this.storage = getStorage(this.app)
    this.auth = getAuth(this.app)
    if (environment.useEmulators) {
      connectFirestoreEmulator(this.db, 'localhost', 8080)
      connectAuthEmulator(this.auth, 'http://localhost:9099', {disableWarnings: true})
    }
  }

  reportError(error: any) {
    ObjMaps.clean(error)
    addDoc(collection(this.db, 'errors'), {
      timestamp: Timestamp.now(),
      ...error}).then()
  }
}
