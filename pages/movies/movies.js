const util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPannelShow: false
  },

  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters?start=0&count=3'
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?start=0&count=3'
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250?start=0&count=3'
    
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映')
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映')
    this.getMovieListData(top250Url, 'top250', 'Top250')
  },

  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/xml', // bug
      },
      method: 'GET',
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },

  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid
    var navTitle = event.currentTarget.dataset.movietitle
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId + '&navTitle=' + navTitle,
    })
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    console.log(moviesDouban)
    var movies = []
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }

      var temp = {
        'stars': util.convertToStarsArray(subject.rating.stars),
        'title': title,
        'average': subject.rating.average,
        'converageUrl': subject.images.large,
        'movieId': subject.id
      }
      movies.push(temp)
    }

    var readyData = {}
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      'movies': movies
    }
    this.setData(readyData)
  },

  onBindFocus:function() {
    console.log("onBindFocus")
    this.setData({
      containerShow: false,
      searchPannelShow: true
    })
  },
  onBindBlue: function(event) {
    var text = event.detail.value
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text
    this.getMovieListData(searchUrl, 'searchResult', "")
  },

  onCancelImgTap: function() {
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      searchResult: {}
    })
  }
})