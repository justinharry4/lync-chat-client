const fs = require('fs');
const path = require('path');

// let outFilePath = path.join(__dirname, 'template.html');

async function renderTemplate(templatePath, context){
    let varStartStr = 'lx--';
    let varEndStr = '--xl';
    let breakStr = '\nlxl-';

    let rawTemplateStr = await fs.promises.readFile(templatePath, 'utf-8');
    let templateStr = rawTemplateStr.split(varEndStr).join(varEndStr + breakStr);
    
    let templateVarRe = new RegExp(varStartStr + '.*' + varEndStr, 'g');
    let breakRe = new RegExp(breakStr, 'g');

    let matches = templateStr.match(templateVarRe);
    let templateVars = matches.map((matchStr) => {
        return matchStr.replace(varStartStr, '').replace(varEndStr, '');
    });
    templateVars = [...(new Set(templateVars))];

    let varMap = {};
    for (let templateVar of templateVars){
        if (context[templateVar] === undefined){
            throw new Error("No variable name '" +
                            templateVar +
                            "' in context object");
        }

        varMap[templateVar] = context[templateVar];
    }

    for (let varName in varMap){
        let varRe = new RegExp(varStartStr + varName + varEndStr, 'g')
        templateStr = templateStr.replace(varRe, varMap[varName]);
    }
    
    let fixedTemplateStr = templateStr.replace(breakRe, '');
    
    // await fs.promises.writeFile(outFilePath, fixedTemplateStr);

    // console.log(varMap);
    // console.log(fixedTemplateStr);

    return outFilePath;
}

// renderTemplate(null, {name: 'Splitz', url: '/blog/hidden', route: 'root'})