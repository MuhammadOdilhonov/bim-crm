"use client"

import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found-content">
                <h1>404</h1>
                <h2>Sahifa topilmadi</h2>
                <p>Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.</p>
                <Link to="/" className="btn btn-primary">
                    Bosh sahifaga qaytish
                </Link>
            </div>
            <style jsx>{`
        .not-found {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 20px;
        }
        
        .not-found-content {
          text-align: center;
          max-width: 500px;
        }
        
        h1 {
          font-size: 120px;
          margin: 0;
          color: #185a9d;
          line-height: 1;
        }
        
        h2 {
          font-size: 30px;
          margin: 0 0 20px;
          color: #333;
        }
        
        p {
          margin-bottom: 30px;
          color: #666;
        }
      `}</style>
        </div>
    )
}

export default NotFound
