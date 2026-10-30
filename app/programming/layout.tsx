import '../jaringan/network.css';
import '../iot/iot.css';

export default function ProgrammingLayout({children}:{children:React.ReactNode}) {
  return <div className="network-academy iot-academy programming-academy">{children}</div>;
}
