0. 项目依赖于puppeteer nodejs
1. movieURL.js 通过清单source/movieSourceList.txt 去找下载地址结果保留在source/movieurl.txt
2. compare.js 获取a.source/compareSource b.source/compareTarget c.source/compare.txt清单  根据c逐项在a中寻找，找到了就算匹配上，然后移动到b，适用于按照清单在种子文件或电影文件中挑选出