//读取需要匹配的字段 减去已经匹配的字段 用没有匹配到的去匹配资源库
var fs = require('fs')
const match=[];

fs.readFile("./source/compare.txt", 'utf-8', (err, data) => {
    if (err) throw err;
    let datas= data.split(/\r\n/).map(item=>item.trim())
    console.log('需要匹配的条数',datas.length);
    let hasfiles=fs.readdirSync('../top600urls')
    datas= datas.filter(item=>{
    	for(let i=0;i<hasfiles.length;i++){
    		if(hasfiles[i].includes(item)){
    			return false;
    		}
    	}
    	return true;
    })
    console.log('减去现存剩余待匹配条数',datas.length);
    

    (async ()=>{
    	try{
    		let files=fs.readdirSync('./source/compareSource')
            console.log('文件列表:',files.length)
            datas.forEach(item=>{
            	let matched=[];
            	files.forEach(f=>{
            		if(f.includes(item)){
            			matched.push(f)
            			console.log(item,f)
            			fs.renameSync(`./source/compareSource/${f}`, `./source/compareTarget/${f}`);
            		}
            	})
            	match.push({[item]:matched})
            })

            fs.writeFile("compare.txt", JSON.stringify(match).replace(/{/g,'\n{'), (err, data) => {
                if (err) throw err;
            })
    		
            
    	}catch(err){
    		console.log(err);
    	}
    })()
});