
export const translateObjectName = (name: string,value: string) => {
const parts = name.split('.');
return parts.reduceRight((acc: any, key: any) => ({ [key]: acc }), value);
};
const nameStr = "a.b.c.d";
console.log(translateObjectName(nameStr,'value'));

