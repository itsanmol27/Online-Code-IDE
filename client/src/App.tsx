import './App.css'
import Terminal from './component/Terminal'

function App() {

  return (
    <div className='playground-container'>
      <div className='container'>
        <div className='files-container'></div>
        <div className='code-container'></div>
      </div>
      <div className='terminal-container'>
        <Terminal />
      </div>
    </div>
  )
}

export default App
