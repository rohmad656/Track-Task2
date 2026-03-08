import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  userId: string;
  createdAt: any;
}

export const taskService = {
  subscribeToTasks: (userId: string, callback: (tasks: Task[]) => void) => {
    const q = query(
      collection(db, "tasks"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      callback(tasks);
    });
  },

  addTask: async (task: Omit<Task, "id" | "createdAt">) => {
    return await addDoc(collection(db, "tasks"), {
      ...task,
      createdAt: serverTimestamp()
    });
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const taskRef = doc(db, "tasks", taskId);
    return await updateDoc(taskRef, updates);
  },

  deleteTask: async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    return await deleteDoc(taskRef);
  }
};
