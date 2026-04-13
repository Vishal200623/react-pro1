import React, { useState, useEffect } from "react";

export default function App() {
  const [reminders, setReminders] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [triggered, setTriggered] = useState({});

 
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reminders")) || [];
    setReminders(data);
  }, []);

 
  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      const timeString = `${hours}:${minutes}:${seconds}`;
      setCurrentTime(timeString);

      reminders.forEach((r, index) => {
        const reminderTime = `${r.time}:00`;

        if (reminderTime === timeString && !triggered[index]) {
          if (Notification.permission === "granted") {
            new Notification(" Medicine Reminder", {
              body: "Time to take: " + r.medicine,
            });
          } else {
            alert("Time to take: " + r.medicine);
          }

          setTriggered((prev) => ({
            ...prev,
            [index]: true,
          }));
        }
      });

     
      if (seconds === "00") {
        setTriggered({});
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders, triggered]);

  const addReminder = () => {
    if (!medicine || !time) {
      alert("Please enter medicine and time");
      return;
    }

    setReminders([...reminders, { medicine, time }]);
    setMedicine("");
    setTime("");
  };

  const deleteReminder = (index) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Medicine Reminder </h1>

      <h2>Current Time: {currentTime}</h2>

      <input
        placeholder="Medicine Name"
        value={medicine}
        onChange={(e) => setMedicine(e.target.value)}
      />
      <br /><br />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <br /><br />

      <button onClick={addReminder}>Add Reminder</button>

      <div style={{ marginTop: "20px" }}>
        {reminders.map((r, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p>
              <b>{r.medicine}</b> - {r.time}:00
            </p>
            <button onClick={() => deleteReminder(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}