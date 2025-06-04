
export const translateObjectName = (name?: string|null|boolean,value?: string|null|boolean) => {
    if (!name || typeof name !== 'string') {
        throw new Error('name is required');
    }
const parts = name.split('.');
return parts.reduceRight((acc: any, key: any) => ({ [key]: acc }), value);
};

