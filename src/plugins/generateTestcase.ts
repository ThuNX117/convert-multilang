// const template=`1	Bổ sung Tiếng Thái cho tiêu đề tại modal「Admin menu」	モーダル「管理メニュー」のタイトルにタイ語を追加				"- Ngôn ngữ: Tiếng Thái
// - Click vào icon [Nine-dot menu icon] trên header -> Quan sát menu "	"- 言語：タイ語

import { LangKey } from "../types";

// - ヘッダーの[9つの点のメニューアイコン]をクリック -> [表示]メニュー"	1. "アンケート" -> "แบบสอบถาม"	1.「アンケート」→「แบบสอบถาม」`
const breakingCell='	'


type LanguageKeyType = 'vie' | 'thai' | 'eng' | 'jap' | 'cn';
// const configHeader: Array<LanguageKeyType> = ['jap', 'vie', 'eng', 'cn', 'thai',];
type ParameterType={context:string,lang:LanguageKeyType,  scope:string, url:string,data:Array<[string, string]>}
const config=({lang, context, scope, url,data,}:ParameterType)=>{ 
    
    const langTitle=LangKey[lang]
    // Use line break character that Excel recognizes within a cell
    const excelLineBreak = `\n`; // For most modern Excel versions on Windows and Mac

    return {
        no: '',
        url: url,
        scope: scope,
        title: `Bổ sung ${langTitle} cho tiêu đề tại ${scope}`,
        jaTitle: '',
        jaDescription: '',
        context: `"- Ngôn ngữ: ${langTitle} - ${context} ` + context + '"',
        expected: '"'+data.map(([originalLang, translatedLang]) => `-「${originalLang}」→ 「${translatedLang}」`).join(excelLineBreak) +'"'
    }}
export const generateTestcase =({lang, context, scope, url,data,}:ParameterType&{data:Array<Array<string>>})=>{
    const conf = config({lang, context, scope,url,data,});
    const row = [
        conf.no,
        conf.title,
        '',
        conf.url,
        conf.scope,
       conf.context,
        '',
        '',
        
        '',

        conf.expected,
    ].join(breakingCell);

    // Copy to clipboard (Node.js)
    if (typeof window !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(row);
    } else {
        console.warn('Clipboard API is not available. Context:',row);
    }

    return  [
         conf.no,
        conf.title,
        "",
        conf.url,
        conf.scope,
        '',
        conf.context,

        '',
        conf.expected,
        '',

    ];
}