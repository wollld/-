//很多bug
var fs = require('fs')
const puppeteer = require('puppeteer');

fs.readFile("./source/movieSourceList.txt", 'utf-8', (err, data) => {
    if (err) throw err;
    let datas= data.split(/\r\n/).map(item=>item.trim())
    console.log(datas);
    

    (async ()=>{
    	try{
    		let browser = await puppeteer.launch({
		        // 是否不显示浏览器， 为true则不显示
		        'headless': true,
		        ignoreDefaultArgs: ["--enable-automation"]
		    });
		    // 通过浏览器实例 Browser 对象创建页面 Page 对象
		    let page = await browser.newPage();
		    // 设置浏览器信息
		    const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/63.0.3239.84 Chrome/63.0.3239.84 Safari/537.36";
		    await Promise.all([
		        page.setUserAgent(UA),
		        // 允许运行js
		        page.setJavaScriptEnabled(true),
		        // 设置页面视口的大小
		        page.setViewport({width: 1366, height: 768}),
		    ]);

    		for(let i=0;i<datas.length;i++){
    			await page.goto('http://movie.jxesk.cn/?m=vod-play-id-91988-src-1-num-1.html');//打开
    			await page.waitFor(3000);

               
                if(i===0){
                    console.log('关闭弹框')
                    await page.click('#notee #g_close');
                    console.log('关闭弹框成功')
                }
    			console.log('输入电影名')
    			await page.type('#wd', datas[i]);
    			console.log('点击搜索按钮')
    			await page.click('button#submit');    
    			await page.waitFor(3000);

    			let movies= await page.$$eval('dl.content .head h3',divs=>divs.map(e=>e.textContent))
    			console.log('电影数量:电影列表',movies.length,movies)
    			let movieIndex= [...movies].findIndex(m=>{return m===datas[i]})
    			console.log(movieIndex!==-1)
    			if(movieIndex!==-1){

    				await page.click('.hy-video-details:nth-child('+(movieIndex+2)+') .videopic')
    				await page.waitFor(5000);
                    let playList= await page.$$('ul.playlistlink-1>li>a,.playlistlink-2 a,.playlistlink-3 a');
                    if(playList.length>0){
                        let href=await page.$eval('ul.playlistlink-1>li>a,.playlistlink-2 a,.playlistlink-3 a',ele=>ele.href);
                        console.log(href)
                        await page.goto(href);
                        await page.waitFor(5000);
                        let ifram= await page.frames().find(frame => /\.(mp4|rm|rmvb|mov|mtv|wmv|avi|3gp|amv|mpg)$/.test(frame.url()))
                        if(ifram){
                            let video=await ifram.$eval('video',ele=>ele.src)
                            datas[i]={name:datas[i],url:video}
                            console.log(video)
                        }
                    }
                    
    			}
                console.log('第n个任务:',i)
                fs.writeFile("./source/movieurl.txt", JSON.stringify(datas), (err, data) => {
                    if (err) throw err;
                })
    		}
            
    	}catch(err){
    		console.log(err);
    	}
    })()
});