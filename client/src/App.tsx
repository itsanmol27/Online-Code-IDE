import './App.css'
import FileTree from './component/FileTree'
import Terminal from './component/Terminal'

function App() {

  return (
    <div className=' h-screen w-screen overflow-hidden flex flex-col'>
      <div className='flex flex-row h-full w-full'>
        <div className=' w-1/4 h-full bg-gray-800 text-white'>
          <FileTree />
        </div>
        <div className=' w-full h-full bg-gray-900 text-white'>

        </div>
      </div>
      <div className=''>
        <Terminal />
      </div>
    </div>
  )
}

export default App
