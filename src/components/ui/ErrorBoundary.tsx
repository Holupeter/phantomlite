'use client'

import * as Sentry from '@sentry/nextjs'
import { Component, ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  eventId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, eventId: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Send error to Sentry with full context
    const eventId = Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
    this.setState({ eventId })
    console.error('[PhantomLite Error]:', error)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 16, padding: 32, textAlign: 'center',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'rgba(239,68,68,0.1)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24,
          }}>
            ⚠
          </div>
          <div>
            <p style={{
              fontSize: 14, fontWeight: 600,
              color: '#fff', marginBottom: 6,
            }}>
              Something went wrong
            </p>
            <p style={{ fontSize: 12, color: '#6b7280' }}>
              {this.state.error?.message}
            </p>
            {this.state.eventId && (
              <p style={{
                fontSize: 10, color: '#4b5563',
                marginTop: 6, fontFamily: 'monospace',
              }}>
                Error ID: {this.state.eventId}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null, eventId: null })}
              style={{
                padding: '10px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 10, fontSize: 13,
                fontWeight: 500, color: '#fff', cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <button
              onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId ?? undefined })}
              style={{
                padding: '10px 20px',
                background: 'rgba(124,58,237,0.12)',
                border: '0.5px solid rgba(124,58,237,0.25)',
                borderRadius: 10, fontSize: 13,
                fontWeight: 500, color: '#a78bfa', cursor: 'pointer',
              }}
            >
              Report issue
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}