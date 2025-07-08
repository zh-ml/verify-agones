import PodForm from './components/PodForm';
import PodList from './components/PodList';
import { usePodWatchSocket } from './usePodSocket';
// import { usePodStore } from './store/podStore';

export default function App() {
  // const { setError } = usePodStore();

  // 监听 Pod 事件，用于实时更新
  usePodWatchSocket((event) => {
    console.log('Pod event received:', event);
    // 可以在这里处理特定的事件类型
  });

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: '0', color: '#333' }}>Kubernetes Pod 管理系统</h1>
        <p style={{ margin: '10px 0 0 0', color: '#666' }}>
          创建、管理和监控 Kubernetes Pod
        </p>
      </header>
      
      <main>
        <PodForm />
        <PodList />
      </main>
    </div>
  );
}