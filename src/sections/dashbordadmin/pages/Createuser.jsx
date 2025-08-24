import Button from "../../../components/buttons/Button";
import "./dashboard.css";

const Createuser = () => {
  return (
    <div className="containers">
      <div className="form-wrapper">
        <h2>إنشاء مستخدم جديد</h2>
        <form>
          <div className="form-group">
            <label>اسم المستخدم</label>
            <input type="text" placeholder="أدخل اسم المستخدم" />
          </div>

          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" placeholder="example@mail.com" />
          </div>

          <div className="form-group">
            <label>كلمة المرور</label>
            <input type="password" placeholder="••••••" />
          </div>

          <Button type="submit" className="submit-button">
            إنشاء الحساب
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Createuser;
