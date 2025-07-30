// 示例数据
const sampleList = [
    { id: 0, image: '/minecraft.svg', webp: '/minecraft.webp', name: 'minecraft-java', content: '¥ 20000 / month', isClick: 'true' },
    { id: 1, image: '/vite.svg', webp: '/vite.svg', name: 'item1', content: 'item1', isClick: 'false' },
    { id: 2, image: '/vite.svg', webp: '/vite.svg', name: 'item2', content: 'item2', isClick: 'false' },
    { id: 3, image: '/vite.svg', webp: '/vite.svg', name: 'item3', content: 'item3', isClick: 'false' },
    { id: 4, image: '/vite.svg', webp: '/vite.svg', name: 'item4', content: 'item4', isClick: 'false' },
    { id: 5, image: '/vite.svg', webp: '/vite.svg', name: 'item5', content: 'item5', isClick: 'false' },
  ];

// match sampleList by id
const allVersion = [
    {id: 0, versions: ['1.21.7', '1.21.6', '1.21.5', '1.21.4']},
]

const cpuOptions = ['1', '2', '3', '4'];
const memoryOptions = ['1', '2', '3', '4'];

const GameServerState = {
  ALLOCATED: "Allocated",
  READY: "Ready",
  SHUTDOWN: "Shutdown",
  SCHEDULED: "Scheduled",
  ALL: "All",
};

export {
    sampleList,
    allVersion,
    cpuOptions,
    memoryOptions,
    GameServerState,
};