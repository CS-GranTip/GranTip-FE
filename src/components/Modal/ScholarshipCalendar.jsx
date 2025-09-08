import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { parseISO, format } from "date-fns";
import "./ScholarshipCalendar.css";
import rmyIcon from "../../assets/rnext.svg";
import lmyIcon from "../../assets/lnext.svg";

const ScholarshipCalendar = ({ subscribedScholarships }) => {
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // 이벤트 매핑
  const events = Array.isArray(subscribedScholarships)
    ? subscribedScholarships.map((s) => ({
        title: s.productName,
        start: parseISO(s.applicationStartDate),
        end: parseISO(s.applicationEndDate),
        allDay: true,
        id: s.id,
      }))
    : [];

  // 상세 페이지 새 탭 오픈
  const handleEventClick = (info) => {
    window.open(`/detail/${info.event.id}`, "_blank");
  };

  // 이전/다음 이동
  const movePrev = () => {
    const api = calendarRef.current.getApi();
    api.prev();
    setCurrentDate(api.getDate());
  };
  const moveNext = () => {
    const api = calendarRef.current.getApi();
    api.next();
    setCurrentDate(api.getDate());
  };

  return (
    <div className="scholar-calendar-root">
      {/* 커스텀 툴바 */}
      <div className="calender-wrapper">
        <div onClick={movePrev} className="calender">
          <img src={lmyIcon} alt="이전 달" className="calender-btn" />
        </div>
        <span>{format(currentDate, "yyyy.MM")}</span>
        <div onClick={moveNext} className="calender">
          <img src={rmyIcon} alt="다음 달" className="calender-btn-n" />
        </div>
      </div>

      {/* FullCalendar */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        views={["dayGridMonth", "dayGridWeek"]}
        events={events}
        eventClick={handleEventClick}
        displayEventEnd={true}
        height="auto"
        fixedWeekCount={false}
        headerToolbar={false} // 기본 헤더 숨김
        eventContent={(
          arg // 장학금 라벨 커스텀 렌더링
        ) => (
          <div className="scholar-bar" title={arg.event.title}>
            <span className="ellipsed">{arg.event.title}</span>
          </div>
        )}
      />
    </div>
  );
};

export default ScholarshipCalendar;
