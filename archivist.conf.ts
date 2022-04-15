
import * as archivist from "archivist/index.ts";

export {archivist};

//import * as archivist from "https://raw.githubusercontent.com/dpeter99/archivist/0.2.0/src/index.ts";


let env : "development" | "production" = "development"
if(Deno.args.includes("--env=prod")){
    env = "production"    
}
console.log(env);

export const config: archivist.Config = {
    detailedOutput: false,
    template: "./template",
    outputPath: "./out",
    outputURL: "https://asao.github.io",
    env: env,
    preProcessors: [
        archivist.Pipeline.fromModules({name:"build_template", contentRoot:"./content/"},
            new archivist.StaticTemplateFilesModule(),
            //new archivist.CopyModule({source:"./content/static"})
        )
    ],
    pipelines:[
        archivist.Pipeline.fromModules({name:"asao_articles",contentRoot:"./articles/"},
            new archivist.FileReaderModule("./**/*.md"),
            new archivist.ExtractMetadata(
                new archivist.FrontMatterMetadata()
            ),
            new archivist.FunctionModule(doc => {
                if(!doc.metadata.hasData("type")){
                    doc.metadata.addData("type","post");
                }
            }),
            new archivist.MarkdownRender({
                shiftHeadersAmount:1
            }),
            new archivist.ExtractResources(),
            new archivist.WebUrlOutputResolver(),
            new archivist.TemplateModule({helper:(path, mod)=>{
                return new ASAOHelper(path, mod);
            }}),
            new archivist.OutputModule()
        )
    ]
}

class ASAOHelper extends archivist.ArticleHelper {
    
    constructor(file:string, module:archivist.SimpleModule){
        super(file,module)
    }

    ASAO_ID(doc){
        

        return String(doc.meta.asao_id).padStart(4, '0');
    }

}


//console.log(archivist);

//archivist.run(config);