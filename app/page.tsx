"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Terminal, ArrowRight, Lock } from "lucide-react";
import { SA_PASSWORD } from "@/lib/data";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!pw) { setErr("password required"); return; }
    setErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 650));
    if (pw === SA_PASSWORD) {
      sessionStorage.setItem("sa", "1");
      router.push("/dashboard");
    } else {
      setErr("authentication failed — incorrect password");
      setLoading(false);
    }
  };

  return (
    <div className="mesh" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>

      <div style={{ position: 'fixed', top: '28%', left: '50%', transform: 'translateX(-50%)', width: 640, height: 360, background: 'radial-gradient(ellipse, rgba(0,229,153,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="anim-up" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: 'var(--acc-dim)', border: '1px solid var(--line-acc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Terminal size={16} color="var(--acc)" strokeWidth={2} />
          </div>
          <div>
            <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', letterSpacing: '-0.01em' }}>academy-platform</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--t3)' }}>superadmin console</div>
          </div>
        </div>

        {/* Terminal card */}
        <div className="card" style={{ overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.55)' }}>

          {/* Title bar */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)' }}>
            <div className="term-dots">
              <span style={{ background: 'var(--red)' }} />
              <span style={{ background: 'var(--amb)' }} />
              <span style={{ background: 'var(--grn)' }} />
            </div>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>auth — platform</span>
          </div>

          <div style={{ padding: 24 }}>
            <div className="mono" style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 18 }}>
              <span style={{ color: 'var(--acc)' }}>$</span> connect --role=super_admin<span className="cursor-blink" />
            </div>

            {/* Role chip */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 10px',
              borderRadius: 'var(--r-sm)', background: 'var(--acc-dim)', border: '1px solid var(--line-acc)',
              marginBottom: 20
            }}>
              <div style={{ width: 5, height: 5, borderRadius: 1, background: 'var(--acc)' }} />
              <span className="mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--acc)' }}>
                role: super_admin
              </span>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 14 }}>
              <label className="label" style={{ display: 'block', marginBottom: 7 }}>
                password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }}>
                  <Lock size={13} />
                </div>
                <input
                  className="input"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={pw}
                  onChange={e => { setPw(e.target.value); setErr(""); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{ paddingLeft: 34, paddingRight: 40 }}
                  autoFocus
                />
                <button
                  onClick={() => setShow(v => !v)}
                  style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', display: 'flex' }}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {err && (
              <div className="mono" style={{
                padding: '8px 11px', borderRadius: 'var(--r-sm)', marginBottom: 14,
                background: 'var(--red-dim)', border: '1px solid rgba(242,73,92,0.25)',
                fontSize: 11.5, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 7
              }}>
                <span>✕</span> {err}
              </div>
            )}

            {/* Submit */}
            <button
              className="btn btn-primary"
              onClick={handleLogin}
              disabled={loading}
              style={{ width: '100%', height: 38, fontSize: 12.5, opacity: loading ? 0.75 : 1 }}
            >
              {loading ? (
                <div style={{ width: 13, height: 13, border: '2px solid rgba(6,20,15,0.3)', borderTopColor: '#06140F', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>authenticate <ArrowRight size={13} strokeWidth={2.5} /></>
              )}
            </button>
          </div>

          {/* Hint footer bar */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', background: 'var(--surface)' }}>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--t3)' }}>demo credential → </span>
            <span className="mono" style={{ color: 'var(--acc)', fontSize: 11, fontWeight: 600 }}>superadmin123</span>
          </div>
        </div>

        {/* Footer */}
        <p className="mono" style={{ textAlign: 'center', marginTop: 22, fontSize: 10.5, color: 'var(--t3)', letterSpacing: '0.02em' }}>
          academy-platform · superadmin-console v2.1.0
        </p>
      </div>
    </div>
  );
}
