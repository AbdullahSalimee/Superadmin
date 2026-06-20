"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { SA_PASSWORD } from "@/lib/data";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!pw) { setErr("Password is required."); return; }
    setErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 750));
    if (pw === SA_PASSWORD) {
      sessionStorage.setItem("sa", "1");
      router.push("/dashboard");
    } else {
      setErr("Incorrect password.");
      setLoading(false);
    }
  };

  return (
    <div className="mesh" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(71,139,255,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="anim-up" style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #478BFF 0%, #2B5CE6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(71,139,255,0.3), 0 12px 40px rgba(71,139,255,0.3)',
          }}>
            <ShieldCheck size={24} color="white" strokeWidth={2.2} />
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--blu)', marginBottom: 8 }}>
            Academy Platform
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--t1)', marginBottom: 8 }}>
            Super Admin Console
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>
            Platform-level access · Not tied to any academy
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>

          {/* Role chip */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px',
            borderRadius: 8, background: 'var(--blu-dim)', border: '1px solid var(--line-blu)',
            marginBottom: 22
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blu)', boxShadow: '0 0 6px var(--blu)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--blu)' }}>
              Super Admin
            </span>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 7 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t3)' }}>
                <Lock size={14} />
              </div>
              <input
                className="input"
                type={show ? 'text' : 'password'}
                placeholder="Enter master password"
                value={pw}
                onChange={e => { setPw(e.target.value); setErr(""); }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ paddingLeft: 36, paddingRight: 42 }}
                autoFocus
              />
              <button
                onClick={() => setShow(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', display: 'flex' }}
              >
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <div style={{
              padding: '9px 12px', borderRadius: 8, marginBottom: 14,
              background: 'var(--red-dim)', border: '1px solid rgba(255,91,91,0.2)',
              fontSize: 12, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 7
            }}>
              <span style={{ fontSize: 15 }}>⚠</span> {err}
            </div>
          )}

          {/* Submit */}
          <button
            className="btn btn-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', height: 42, fontSize: 13, opacity: loading ? 0.75 : 1 }}
          >
            {loading ? (
              <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.65s linear infinite' }} />
            ) : (
              <>Access Platform Console <ArrowRight size={14} strokeWidth={2.5} /></>
            )}
          </button>

          {/* Hint */}
          <div style={{ marginTop: 18, padding: '10px 12px', borderRadius: 8, background: 'var(--raised)', border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>Demo · </span>
            <span className="mono" style={{ color: 'var(--blu)', fontSize: 12 }}>superadmin123</span>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--t3)', letterSpacing: '0.03em' }}>
          Academy Management Platform · v2.0
        </p>
      </div>
    </div>
  );
}
