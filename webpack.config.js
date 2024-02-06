//https://webpack.kr/ 참고

const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
//HtmlWebpackPlugin은 웹팩 빌드시 output에 있는 bundle.js를 자동으로 import

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//css는 읽은 후 어딘가에 저장을 해야 함
//css를 index.html에 합치는 방법도 있지만 파일을 추출하기 위해 MiniCssExtractPlugin을 사용

const {CleanWebpackPlugin} = require("clean-webpack-plugin");
//사용 안하는 파일을 자동으로 삭제해주는 플러그인

const webpack = require('webpack'); 

module.exports = {
  //entry : 웹팩이 빌드할 파일
  //이렇게 한다면 src/index.js 파일 기준으로 import 되어 있는 모든 파일들을 찾아 하나의 파일로 합치게 됩니다
  entry: "./src/index.js",
  output: {
    //웹팩에서 빌드가 완료되면 아래 output에 명시된 정보를 통해 빌드파일을 생성
    filename: "bundle.js",
    path: path.resolve(__dirname + "/build")
  },
  devServer: {
    //webpack-dev-server는 소스코드 수정 시 알아서 웹팩이 빌드해주는 역할 위한 것
    static: {
      directory: path.join(__dirname, 'build'),
      staticOptions: {
        index: 'index.html',
      },
    },
    port: 9000
  },
  //mode는 웹팩 빌드 옵션.
  //production은 최적화되어 빌드되는 특성, development는 빠르게 빌드되는 특성, none은 아무런 기능 없이 웹팩으로 빌드
  mode: "none",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: "/node_modules",
        //babel-loader는 우리가 사전에 작업한 .babelrc를 참고하여 리액트와 ES6를 ES5로 반환
        use: ['babel-loader'],
      },
      {
        //test : 가지고 올 파일의 정규식
        test: /\.html$/,
        use: [
          {
            //로더는 자바스크립트 파일이 아닌 파일을 웹팩이 이해할 수 있게 해줌
            //loader 에는 사용할 로더의 이름
            loader: "html-loader",
            //options에는 로더의 옵션을 설정
            //minimize 옵션을 꺼주시면 줄바꿈된 형태로 보여집니다.
            options: { minimize: true }

            //위 내용은 html 파일을 읽었을 때 html-loader를 실행하여 웹팩이 이해할 수 있게 하고 options 으로는 minimize 라는 코드 최적화 옵션을 사용
          }
        ]
      },
      {
        //css 사용을 위한 로더 추가
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
        /**
         * use에 있는 loader 순서는 오른쪽에서 왼쪽 순서로 실행이 됩니다.
         * 위에 있는 코드에 의미는 css-loader로 css 파일을 읽고 MniCssExtractPlugin.loader로 읽은 CSS를 파일로 추출해 냅니다.
         */
      },
      {
        //sass loader를 추가하여 scss 파일을 읽을 수 있게 함
        //sass-loader로 scss파일을 읽고 css로 변환한 후 css-loader로 css파일을 읽음
        //그 후 MiniCssExtractPlugin.loader로 읽은 CSS를 파일로 추출
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    //html-webpack-plugin은 웹팩이 html 파일을 읽어서 html 파일을 빌드할 수 있게 해줌
    new HtmlWebPackPlugin({
			template: './public/index.html', // public/index.html 파일을 읽는다.
      filename: 'index.html' // output으로 출력할 파일은 index.html 이다.
    }),
    new webpack.DefinePlugin({ //정적 웹 띄울 때 process를 못 찾는 경우 추가
      
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CleanWebpackPlugin()
  ]
};