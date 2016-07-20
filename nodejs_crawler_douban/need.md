## 针对豆瓣网的爬虫

1. 有时候我们找电影，要找的是某个类型的电影，然后又希望评分很高
2. 我们希望看的能定不能是像豆瓣那样的分类标签（有时候分类标签不准确），我希望的是从长评里面统计关键词的出现次数（最好有模糊搜索，就是相近的词语都算到词频里面）。
3. 至于模糊搜索，可以先去网络上搜索这个单词的近义词，然后应该有个权值，ex： 我们输入的权值是10，然后搜索到的近义词是5
4. 还要有一定的评价人数
5. 长评里面，出现的精彩，紧凑，叼，赞，好看，一类的词都是可以在权值面的


## 爬虫爬取流程

1. 首先从'https://movie.douban.com/subject_search?search_text=' + '你想要搜索的东西' + '&cat=1002'，搜索一波

## 点子

### 现在重要的不是怎么爬，感觉技术这方面总是可以解决的，重要的是点子

1. 就是普通的豆瓣，知乎上面的一些信息
2. 分析一波全国互联网公司的职位还有相应的薪资，各个公司环境的分析，租房，技术特点

### 别人的爬虫的点子

1. 爬取知乎上面人物的头像，并作分析
2. 爬取twitter上面 将近400亿条推文，分析某个词在twitter在上面出现的频率，或者是上面的分析曲线图加上一些其他的图分析数据
3. 把学校在线服务用爬虫集成一套json api 然后加上一个类似微信的校友圈的app
4. 通过爬虫，抓取你关注的人的动态，然后发送邮箱或者其他的方式通知
5. 获取各个机场的实时流量，获取热点城市的火车票情况，各个热门公司招聘中的职位数以及月薪的分布，某公司门店的变化情况，对一些金融产品的跟照，对某个app下载量的跟踪
6. 