export function slugGenerator(name:string):string{
    return name.toLowerCase().split(" ").join("-")
}