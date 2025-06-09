export type UILogType = {
    msg: string;
    type: string;
    data: any;
};
export type PopupLogButton = {
    UILog: UILogType[];
};
export type LanguageKeyType = 'vie' | 'thai' | 'eng' | 'jap' | 'cn';
export const configHeader: Array<LanguageKeyType> = ['jap', 'vie', 'eng', 'cn', 'thai',];
export const LangKey:Record<LanguageKeyType,string>={
        jap: 'Tiếng Nhật',
        thai: 'tiếng Thái',
        eng: 'Tiếng Anh',
        vie: 'Tiếng Việt',
        cn: 'Tiếng Trung',
    }