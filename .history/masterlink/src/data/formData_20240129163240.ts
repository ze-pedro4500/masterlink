import {Field} from "./field"

export interface FormData {
    id: number,
    title: string,
    fields: Field[]
}