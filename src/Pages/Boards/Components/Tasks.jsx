import { generateRandomString } from "../../../Utils/String";
import Task from "./Task";

export default function Tasks({ taskList }) {
    return taskList.map(task => 
        <Task key={generateRandomString()} task={task} />
    )
}