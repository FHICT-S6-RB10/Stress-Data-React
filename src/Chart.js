import './App.scss';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = ({patientId}) => {

  var testData = [];
  const [data,setData] = useState([])
  //const { data:patientStressData, isPending, error } = useFetch("https://localhost:5001/stressmeasurements/patient/"+patientId);
  const [patientStressData, setPatientStressData] = useState([])
  useEffect(()=>{
    getPatientStressData()

  },[])

  useEffect(()=>{
    if(patientStressData.length> 0){
      patientStressData.slice(0,100).forEach(stressData =>{
        var date = new Date(stressData.timeStamp.substring(0, 19));
        //var day = date.getDay();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        console.log(minutes);
        if(minutes===0){
          minutes = "00";
        }
        //var seconds = date.getSeconds();
        
        var datapoint = {
          stressValue: stressData.heartRateVariability,
          timeStamp: hours.toString()+":"+minutes.toString()
        }
        console.log(datapoint.timeStamp)
        testData.push(datapoint);
      });
      setData(testData)
    }
  },[patientStressData])

  const getPatientStressData = async () =>{
   await axios.get("https://localhost:5001/heartratevariabilitymeasurements/patient/"+patientId).then((res)=>{
      setPatientStressData([...res.data])
    })
  }
  
  
  return (

    <div className="responsiveContainerDiv">
    <ResponsiveContainer width="85%" aspect={3}>
      
        <LineChart
          allowDataOverflow={true}
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
              <XAxis fontSize={17} dataKey="timeStamp">
                  <Label value="Time" offset={-16} position="insideBottom"/>
              </XAxis>
              <YAxis label={{ value: 'HRV', angle: -90, position: 'insideLeft' }}/>
              <Tooltip />
              <Line type="monotone" dataKey="stressValue" stroke="#8884d8" fill="#8884d8" fillOpacity={1} activeDot={{ r: 8 }} />
              {/* we have onClick  */}
        </LineChart>
      </ResponsiveContainer>
      </div>
  );
}

export default App;
