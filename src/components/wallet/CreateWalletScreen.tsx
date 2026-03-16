'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SEED_WORDS = [
  'timber', 'vocal', 'marble', 'frown',
  'syntax', 'clinic', 'orbit', 'velvet',
  'alpine', 'rogue', 'sunset', 'drape',
]

type CreateStep = 'generate' | 'verify' | 'secure'

export function CreateWalletScreen() {
  const [step, setStep] = useState<CreateStep>('generate')
  const [hidden, setHidden] = useState(false)
  const [copied, setCopied] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verifyWords, setVerifyWords] = useState<Record<number, string>>({})
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(SEED_WORDS.join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = () => {
    const mistakes = [2, 5, 9].filter(
      (i) => verifyWords[i]?.toLowerCase().trim() !== SEED_WORDS[i]
    )
    if (mistakes.length > 0) {
      setError('One or more words are incorrect. Please check and try again.')
      return
    }
    setError('')
    setStep('secure')
  }

  const handleSecure = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setDone(true)
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 16,
          padding: '48px 24px', textAlign: 'center',
        }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(52,211,153,0.12)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 30,
        }}>
          ✓
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
          Wallet Created
        </div>
        <div style={{
          fontSize: 13, color: '#6b7280',
          lineHeight: 1.7, maxWidth: 280,
        }}>
          Your new wallet has been created and secured. You can now send and receive crypto.
        </div>
        <div style={{
          padding: '10px 20px', borderRadius: 20,
          background: 'rgba(52,211,153,0.1)',
          border: '0.5px solid rgba(52,211,153,0.2)',
          fontSize: 11, fontWeight: 500, color: '#34d399',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#34d399', display: 'inline-block',
          }} />
          Wallet Ready
        </div>
      </motion.div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
      <div style={{
        padding: '24px 20px 16px',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
          Create Wallet
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
          Generate a new wallet with a recovery phrase
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          {(['generate', 'verify', 'secure'] as CreateStep[]).map((s, i) => (
            <div
              key={s}
              style={{
                padding: '4px 12px', borderRadius: 20,
                fontSize: 10, fontWeight: 600,
                letterSpacing: 0.5, textTransform: 'uppercase',
                background: step === s
                  ? 'rgba(124,58,237,0.15)'
                  : 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${step === s
                  ? 'rgba(124,58,237,0.3)'
                  : 'rgba(255,255,255,0.08)'}`,
                color: step === s ? '#a78bfa' : '#4b5563',
              }}
            >
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Generate ── */}
        {step === 'generate' && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >

            {/* Warning */}
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '12px 14px',
              background: 'rgba(251,191,36,0.07)',
              border: '0.5px solid rgba(251,191,36,0.2)',
              borderRadius: 12,
              fontSize: 12, color: '#fbbf24', lineHeight: 1.6,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠</span>
              <span>Never share your seed phrase. Anyone with these words can access your wallet and steal your funds.</span>
            </div>

            {/* Section label */}
            <div style={{
              fontSize: 10, letterSpacing: 1.5,
              textTransform: 'uppercase', color: '#6b7280', fontWeight: 500,
            }}>
              Your Recovery Phrase
            </div>

            {/* Seed grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
            }}>
              {SEED_WORDS.map((word, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                  }}
                >
                  <span style={{
                    fontSize: 9, color: '#4b5563',
                    fontWeight: 600, minWidth: 14,
                  }}>
                    {i + 1}.
                  </span>
                  <span style={{
                    fontSize: 12, color: hidden ? 'transparent' : '#fff',
                    fontFamily: 'monospace',
                    textShadow: hidden ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
                    userSelect: hidden ? 'none' : 'auto',
                    transition: 'color 0.2s',
                  }}>
                    {word}
                  </span>
                </div>
              ))}
            </div>

            {/* Copy + hide row */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1, padding: '11px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, fontSize: 12, fontWeight: 500,
                  color: copied ? '#34d399' : '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  transition: 'color 0.2s',
                }}
              >
                {copied ? '✓ Copied' : '⎘ Copy phrase'}
              </button>
              <button
                onClick={() => setHidden(!hidden)}
                style={{
                  padding: '11px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, fontSize: 12, fontWeight: 500,
                  color: '#9ca3af', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {hidden ? '👁 Show' : '🙈 Hide'}
              </button>
            </div>

            {/* Info box */}
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '12px 14px',
              background: 'rgba(124,58,237,0.07)',
              border: '0.5px solid rgba(124,58,237,0.2)',
              borderRadius: 12,
              fontSize: 12, color: '#a78bfa', lineHeight: 1.6,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🔒</span>
              <span>Write these words down on paper and store them somewhere safe. Do not save them in a screenshot or cloud storage.</span>
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep('verify')}
              style={{
                width: '100%', padding: 14,
                background: '#7c3aed', border: 'none',
                borderRadius: 12, fontSize: 14,
                fontWeight: 600, color: '#fff', cursor: 'pointer',
              }}
            >
              I've saved my phrase →
            </button>

          </motion.div>
        )}

        {/* ── STEP 2: Verify ── */}
        {step === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >

            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '12px 14px',
              background: 'rgba(124,58,237,0.07)',
              border: '0.5px solid rgba(124,58,237,0.2)',
              borderRadius: 12,
              fontSize: 12, color: '#a78bfa', lineHeight: 1.6,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>✏</span>
              <span>Enter words <strong style={{ color: '#c4b5fd' }}>#3</strong>, <strong style={{ color: '#c4b5fd' }}>#6</strong> and <strong style={{ color: '#c4b5fd' }}>#10</strong> from your recovery phrase to verify you saved it.</span>
            </div>

            {[
              { index: 2, label: 'Word #3' },
              { index: 5, label: 'Word #6' },
              { index: 9, label: 'Word #10' },
            ].map((field) => (
              <div key={field.index}>
                <div style={{
                  fontSize: 10, letterSpacing: 1.5,
                  textTransform: 'uppercase', color: '#6b7280',
                  fontWeight: 500, marginBottom: 6,
                }}>
                  {field.label}
                </div>
                <input
                  type="text"
                  placeholder={`Enter word #${field.index + 1}`}
                  value={verifyWords[field.index] ?? ''}
                  onChange={(e) => {
                    setVerifyWords((prev) => ({ ...prev, [field.index]: e.target.value }))
                    setError('')
                  }}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: '12px 14px',
                    fontSize: 13, color: '#fff',
                    fontFamily: 'monospace', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                  }}
                />
              </div>
            ))}

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(239,68,68,0.08)',
                border: '0.5px solid rgba(239,68,68,0.2)',
                fontSize: 12, color: '#f87171',
              }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setStep('generate'); setError('') }}
                style={{
                  flex: 1, padding: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, fontSize: 13,
                  fontWeight: 600, color: '#fff', cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleVerify}
                style={{
                  flex: 1, padding: 14,
                  background: '#7c3aed', border: 'none',
                  borderRadius: 12, fontSize: 13,
                  fontWeight: 600, color: '#fff', cursor: 'pointer',
                }}
              >
                Verify →
              </button>
            </div>

          </motion.div>
        )}

        {/* ── STEP 3: Secure ── */}
        {step === 'secure' && (
          <motion.div
            key="secure"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >

            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '12px 14px',
              background: 'rgba(124,58,237,0.07)',
              border: '0.5px solid rgba(124,58,237,0.2)',
              borderRadius: 12,
              fontSize: 12, color: '#a78bfa', lineHeight: 1.6,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>🔑</span>
              <span>Set a password to protect your wallet on this device. You will need this to unlock the app.</span>
            </div>

            <div>
              <div style={{
                fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', color: '#6b7280',
                fontWeight: 500, marginBottom: 6,
              }}>
                Password
              </div>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '12px 14px',
                  fontSize: 13, color: '#fff', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              />
            </div>

            <div>
              <div style={{
                fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase', color: '#6b7280',
                fontWeight: 500, marginBottom: 6,
              }}>
                Confirm Password
              </div>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: '12px 14px',
                  fontSize: 13, color: '#fff', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              />
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <div>
                <div style={{
                  display: 'flex', gap: 4, marginBottom: 4,
                }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: password.length >= level * 3
                          ? level <= 1 ? '#f87171'
                          : level <= 2 ? '#fbbf24'
                          : level <= 3 ? '#60a5fa'
                          : '#34d399'
                          : 'rgba(255,255,255,0.08)',
                        transition: 'background 0.2s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>
                  {password.length < 4 ? 'Too weak'
                    : password.length < 7 ? 'Weak'
                    : password.length < 10 ? 'Good'
                    : 'Strong'}
                </div>
              </div>
            )}

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(239,68,68,0.08)',
                border: '0.5px solid rgba(239,68,68,0.2)',
                fontSize: 12, color: '#f87171',
              }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setStep('verify'); setError('') }}
                style={{
                  flex: 1, padding: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, fontSize: 13,
                  fontWeight: 600, color: '#fff', cursor: 'pointer',
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleSecure}
                style={{
                  flex: 1, padding: 14,
                  background: '#7c3aed', border: 'none',
                  borderRadius: 12, fontSize: 13,
                  fontWeight: 600, color: '#fff', cursor: 'pointer',
                }}
              >
                Create Wallet →
              </button>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}