import { generateRandomString } from "../../../Utils/String";
import Task from "./Task";

export default function Tasks({ taskList, board, setBoard }) {
    return taskList.map(task =>
        <Task 
            key={task.token ? task.token : generateRandomString()} 
            task={task} 
            board={board} 
            setBoard={setBoard} 
        />  
    )
}