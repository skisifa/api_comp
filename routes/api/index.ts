import { HandlerContext } from "$fresh/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
const page1 = "https://zapcourses.com/";

interface info{
  "links":string[];
  "titles":string[];
  "images":string[];
}


async function getComp(url:string){
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const a_comp = $(".enroll_btn").attr("href");
  // console.log(new_data);
  return a_comp;
}
 
async function getFirstDataAndSaveIt():Promise<info>{
  let data:info = {"links":[],"titles":[],"images":[]};
  let data_comp:string[] = [];
  const res = await fetch(page1);
  const html = await res.text();
  const $ = cheerio.load(html);
  // a=.entry-button ||
  const a_link = $(".entry-button");
  const a_title = $(".entry-title a");
  const img_link = $(".ct-image-container");

  img_link.each((i,e)=>{
    const img = e.firstChild.attribs.src;
    data["images"].push(img);
  });

  a_title.each((i,e)=>{
    const new_data = e.children[0].data.trim();
    data["titles"].push(new_data);
    // console.log(new_data);
    

  });
   
  a_link.each((i, e) => {
    data["links"].push(e.attribs.href);
    // console.log(comp);
    
  });


  for (let index = 0; index < data["links"].length; index++) {
    const new_link:any = await getComp(data["links"][index]);
    data_comp.push(new_link);

    
  }
  data["links"] = data_comp;
  
  // data["links"].push();
  

  return data;
}






export const handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const data = await getFirstDataAndSaveIt();
  // console.log(data);
  // _ctx.render(JSON.stringify(data))
  return new Response(JSON.stringify(data));
};


 // const link = await fetch("https://darkfortun.com/api/?link=dimaforus.com");
  // console.log();