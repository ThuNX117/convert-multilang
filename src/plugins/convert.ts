
export const translateObjectName = (name?: string|null,value?: string|null) => {
    if (!name) {
        throw new Error('name is required');
    }
const parts = name.split('.');
return parts.reduceRight((acc: any, key: any) => ({ [key]: acc }), value);
};
const nameStr = "a.b.c.d";
console.log(translateObjectName(nameStr,'value'));

