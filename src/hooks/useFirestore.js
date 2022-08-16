import { useEffect, useState } from "react";
import {
  query,
  orderBy,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/config";

export const useFirestore = (collections, condition) => {
  const [documents, setDocuments] = useState([]);

  useEffect(async () => {
    let collectionRef = collection(db, collections);
    collectionRef = query(collectionRef, orderBy("createdAt"));
    /**condition
     * {
     *  fieldName: 'abc',
     *  operator: '==',
     *  compareValue: 'abc'
     * }
     *
     */

    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }
      collectionRef = query(
        collectionRef,
        where(condition.fieldName, condition.operator, condition.compareValue)
      );
    }
    const unsubcribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocuments(data);
    });

    return unsubcribe;
  }, [collections, condition]);

  return documents;
};
