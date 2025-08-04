import React from 'react';
import { Skeleton, Card, Row, Col } from 'antd';

const LoadingSkeleton = ({ 
  type = 'card', 
  rows = 3, 
  columns = 4, 
  style = {} 
}) => {
  if (type === 'dashboard') {
    return (
      <div style={style}>
        {/* Metrics Cards Skeleton */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Col span={24 / columns} key={index}>
              <Card className="clinic-card">
                <Skeleton 
                  active 
                  title={{ width: '60%' }}
                  paragraph={{ rows: 1, width: ['100%'] }}
                />
              </Card>
            </Col>
          ))}
        </Row>
        
        {/* Main Content Skeleton */}
        <Card className="clinic-card">
          <Skeleton 
            active 
            title={{ width: '20%' }}
            paragraph={{ rows: 8 }}
          />
        </Card>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <Card className="clinic-card" style={style}>
        <Skeleton 
          active 
          title={{ width: '30%' }}
          paragraph={{ rows: rows * 2 }}
        />
      </Card>
    );
  }

  return (
    <Card className="clinic-card" style={style}>
      <Skeleton 
        active 
        paragraph={{ rows }}
      />
    </Card>
  );
};

export default LoadingSkeleton;