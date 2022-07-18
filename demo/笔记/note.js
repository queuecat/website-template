const { response } = require('express')
// 引用express框架
const express = require('express')
const { request } = require('http')
// 创建网站服务器路由对象
const note = express()
// 引入系统模块path获取目录
const path = require('path')
// 引入fs模块
const fs = require('fs')

// 静态资源
//console.log(path.join(__dirname, './public'));
note.use(express.static(path.join(__dirname, './public')))

//获取目录
var dirpath = path.join(__dirname, './public/笔记')
var obj = []
//使用readFileList获取所有结构，将其装入obj中
function readFileList() {
	try {
		//dir存文件夹名称
		var dir = fs.readdirSync(dirpath)
		//遍历所有文件夹
		dir.forEach(function (itm, index) {
			//将其放到docute规定格式中
			obj[index] = {
				title: itm,
				children: [],
			}
			//获取每个文件夹中文件名称
			var files = fs.readdirSync(dirpath + '/' + itm)
			//判断文件夹中是否有文件
			if (files.length > 0) {
				//将文件装入obj中
				var filesList = []
				files.forEach(function (itm2, index2) {
					filesList.push({
						title: itm2,
						link: '/笔记/' + itm + '/' + itm2,
					})
				})
				obj[index].children = filesList
			}
		})
	} catch (err) {
		console.log('\033[41;30m 错误 \033[0m', err.message)
	}
}
readFileList()

//该函数用于在所有文件中搜索key
function searchkey(key) {
	//获取文件中数据
	//var file = fs.readFileSync("./public/笔记/C语言/Test.md", "utf8");
	//用于获取匹配到的索引
	//console.log(file.search(/测试/));
	//用于切割匹配后的字符串
	//console.log(file.substring(15, 18));
	try {
		//获取检索信息放入docute指定格式作为返回值
		SearchResult = []
		//dir存文件夹名称
		var dir = fs.readdirSync(dirpath)
		//遍历所有文件夹
		dir.forEach(function (itm, index) {
			//获取每个文件夹中文件名称
			var files = fs.readdirSync(dirpath + '/' + itm)
			//判断文件夹中是否有文件
			if (files.length > 0) {
				//将文件装入obj中
				var filesList = []
				files.forEach(function (itm2, index2) {
					let file = fs.readFileSync(
						path.join(dirpath + '/' + itm + '/' + itm2),
						'utf8'
					)
					let dex = file.search(RegExp(key))
					if (dex < 0) {
						return
					}
					result = file.substring(
						dex - 5 > 0 ? dex - 5 : 0,
						dex + 5 > file.length ? file.length - 1 : dex + 5
					)
					//将其放到docute规定格式中
					SearchResult.push({
						title: itm,
						link: '/笔记/' + itm + '/' + itm2,
						label: itm2,
						description: result,
					})
				})
			}
		})
		return SearchResult
	} catch (error) {
		console.log('\033[41;30m 错误 \033[0m', error.message)
		return []
	}
}

//用于获取文件名的路由
note.get('/getnote', (req, res) => {
	res.send(JSON.stringify(obj))
})
//用于搜索的路由
note.get('/search', (req, res) => {
	res.send(searchkey(req.query.key))
})

note.use((req, res) => {
	let file = fs.readFileSync(path.join(__dirname + '/public/404.md'), 'utf8')
	res.send(file)
})
//返回路由对象
module.exports = note
