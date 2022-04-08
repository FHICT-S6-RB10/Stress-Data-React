import './App.scss';
import useFetch from './useFetch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { format } from 'date-fns-tz';
import axios from 'axios';
import { useEffect, useState } from 'react';


const App = ({patientId}) => {

  var testData = [];
  const [data,setData] = useState([])
  //const { data:patientStressData, isPending, error } = useFetch("https://localhost:44350/stressmeasurements/patient/"+patientId);
  const [patientStressData, setPatientStressData] = useState([])
  useEffect(()=>{
    getPatientStressData()
    

  },[])

  useEffect(()=>{
    console.log(patientStressData)
    if(patientStressData.length> 0){
      patientStressData.forEach(stressData =>{
        var date = new Date(stressData.timeStamp.substring(0, 19));
        var day = date.getDay();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
  
        var datapoint = {
          stressValue: stressData.stressValue,
          timeStamp: hours.toString()+":"+minutes.toString()
        }
        testData.push(datapoint);
      });
      setData(testData)
    }
  },[patientStressData])

  const getPatientStressData = async () =>{
   await axios.get("https://localhost:44350/heartratevariabilitymeasurements/patient/"+patientId).then((res)=>{
      setPatientStressData([...res.data])
    })
  }
  
  
  return (

    <div className="responsiveContainerDiv">
    <ResponsiveContainer width="85%" aspect={3} >
      
        <LineChart
          allowDataOverflow={true}
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeStamp">
                  <Label value="Time" offset={0} position="insideBottom"/>
              </XAxis>
              <YAxis label={{ value: 'Stress Level', angle: -90, position: 'insideLeft' }}/>
              <Tooltip />
              <Line type="monotone" dataKey="heartRateVariability" stroke="#8884d8" fill="#8884d8" fillOpacity={1} activeDot={{ r: 8 }} />
              {/* we have onClick  */}
        </LineChart>
      </ResponsiveContainer>
      </div>
  );
}

export default App;
